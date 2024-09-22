import { useState, useMemo } from "react";
import { ESelectedGroup } from "../type/misc";

export function useGroup(initialGroup: ESelectedGroup = ESelectedGroup.Tab) {
  const groups = useMemo(
    () => [
      ESelectedGroup.Tab,
      ESelectedGroup.Bookmarks,
      ESelectedGroup.History,
      ESelectedGroup.Settings,
    ],
    [],
  );

  const cyclingGroupLength = groups.length - 1;

  const [currentGroupIndex, setCurrentGroupIndex] = useState(
    groups.indexOf(initialGroup),
  );

  const setGroup = (group: ESelectedGroup) => {
    const index = groups.indexOf(group);
    if (index !== -1) {
      setCurrentGroupIndex(index);
    }
  };

  const prevGroup = () => {
    setCurrentGroupIndex(
      (prevIndex) => (prevIndex - 1 + cyclingGroupLength) % cyclingGroupLength,
    );
  };

  const nextGroup = () => {
    setCurrentGroupIndex((prevIndex) => (prevIndex + 1) % cyclingGroupLength);
  };

  return {
    group: groups[currentGroupIndex],
    setGroup,
    prevGroup,
    nextGroup,
  };
}
