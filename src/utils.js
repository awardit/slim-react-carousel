export const searchChildrenForTag = (node, subject) => {
    if (node.nodeName === subject) {
      return node;
    }
    if (node.childNodes) {
      for (var i = 0; i < node.childNodes.length; i++) {
        return searchChildrenForTag(node.childNodes[i], subject);
      }
    }
    return null;
  }
