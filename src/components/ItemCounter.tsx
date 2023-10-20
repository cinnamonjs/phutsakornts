import { MdChevronRight } from "react-icons/md";

type ItemCounterProps = {
    number: number
}

export const ItemCounter: React.FC<ItemCounterProps> = ({number}) => (
  <div className="flex items-center gap-1 text-default-400">
    <span className="text-small">{number}</span>
    <MdChevronRight className="text-xl" />
  </div>
);
