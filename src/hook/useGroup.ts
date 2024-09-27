import { useState, useCallback } from "react";
import { ESelectedGroup } from "../type/misc";

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
    setCurrentGroupIndex(
      (prevIndex) => (prevIndex - 1 + cyclingGroupLength) % cyclingGroupLength,
    );
  }, []);

  const nextGroup = useCallback(() => {
    setCurrentGroupIndex((prevIndex) => (prevIndex + 1) % cyclingGroupLength);
  }, []);

  return {
    group: groups[currentGroupIndex],
    setGroup,
    prevGroup,
    nextGroup,
  };
}
