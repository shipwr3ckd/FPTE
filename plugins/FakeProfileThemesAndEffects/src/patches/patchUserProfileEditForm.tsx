import { findByName } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import React from "react";

import { findParentInTree, getComponentNameFromType, isElement, type RN } from "@lib/reactNativeRenderTree";
import { Builder } from "@ui/components";

const funcParent = findByName("UserProfileEditForm", false);

export const patchUserProfileEditForm = () =>
  after("default", funcParent, (_args: unknown[], tree: RN.Node) => {
    if (storage.hideBuilder) return tree;

    const parent = findParentInTree(tree, (children): children is RN.Node[] =>
      Array.isArray(children) &&
      children.some(child =>
        isElement(child) &&
        getComponentNameFromType(child.type) === "UserProfileEditFormTextField" &&
        (child.props as any).label === "About Me"
      )
    );

    if (parent) {
      const index = parent.props.children.findIndex(
        child =>
          isElement(child) &&
          getComponentNameFromType(child.type) === "UserProfileEditFormTextField" &&
          (child.props as any).label === "About Me"
      );
      if (index !== -1) {
        parent.props.children.splice(index + 1, 0, <Builder />);
      }
    }

    return tree;
  });