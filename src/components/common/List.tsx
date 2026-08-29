import React from "react";

interface ListProps {
  content: string[];
  listType?: "disc" | "decimal" | "none";
}

const List: React.FC<ListProps> = React.memo(
  ({ content, listType = "none" }) => {
    const ListElement = listType === "decimal" ? "ol" : "ul";

    return (
      <ListElement
        className={`list-${listType} list-inside grid gap-6 max-w-[100ch] marker:font-bold marker:text-red-600`}
      >
        {content.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="text-lg text-gray-800 max-w-5xl"
            dangerouslySetInnerHTML={{ __html: item }}
          />
        ))}
      </ListElement>
    );
  },
);

export default List;
