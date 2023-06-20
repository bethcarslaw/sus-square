import { Stack } from "@chakra-ui/react";
import { NavLink } from "@components/Nav/NavLink/NavLink";
import _ from "lodash";

const Filter = ({ filterKey, objects, activeFilter }) => {
  const options: string[] = _.uniq(objects.map((object) => object[filterKey]));

  return (
    <Stack direction="row" justify="center" mb={10} spacing={6}>
      <NavLink href={`?`} opacity={activeFilter ? 0.6 : 1}>
        all
      </NavLink>
      {options.map((option) => (
        <NavLink
          key={option}
          href={`?filter=${option.toLowerCase()}`}
          opacity={activeFilter === option.toLowerCase() ? 1 : 0.6}
        >
          {option}
        </NavLink>
      ))}
    </Stack>
  );
};

export { Filter };
