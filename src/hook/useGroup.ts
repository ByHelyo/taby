import { ESelectedGroup } from "../type/misc";
import { useState, useCallback } from "react";

const groups = [
  ESelectedGroup.Tab,
  ESelectedGroup.Bookmarks,
  ESelectedGroup.History,
  ESelectedGroup.Settings,
];

const cyclingGroupLength = groups.length - 1;

export function useGroup(initialGroup: ESelectedGroup = ESelectedGroup.Tab) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(
    groups.indexOf(initialGroup),
  );

  const setGroup = (group: ESelectedGroup) => {
    const index = groups.indexOf(group);
    if (index !== -1) {
      setCurrentGroupIndex(index);
    }
  };

  const prevGroup = useCallback(() => {
    if (groups[currentGroupIndex] === ESelectedGroup.Settings) {
      setCurrentGroupIndex(groups.indexOf(ESelectedGroup.History));
    } else {
      setCurrentGroupIndex(
        (prevIndex) =>
          (prevIndex - 1 + cyclingGroupLength) % cyclingGroupLength,
      );
    }
  }, [currentGroupIndex]);

  const nextGroup = useCallback(() => {
    if (groups[currentGroupIndex] === ESelectedGroup.Settings) {
      setCurrentGroupIndex(groups.indexOf(ESelectedGroup.Tab));
    } else {
      setCurrentGroupIndex((prevIndex) => (prevIndex + 1) % cyclingGroupLength);
    }
  }, [currentGroupIndex]);

  return {
    group: groups[currentGroupIndex],
    setGroup,
    prevGroup,
    nextGroup,
  };
}
