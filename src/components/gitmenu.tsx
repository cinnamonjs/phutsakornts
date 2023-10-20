
import {Listbox, ListboxItem} from "@nextui-org/react";
import {IconWrapper} from "@/components/IconWarpper";
import {ItemCounter} from "@/components/ItemCounter";
import {BugIcon, PullRequestIcon, ChatIcon ,PlayCircleIcon, LayoutIcon, BookIcon} from "./icons";

export  function Gitmenu(props: any) {
  return (
    <div className={props.className}>
    <Listbox
      aria-label="User Menu"
      onAction={(key) => alert(key)}
      className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[300px] overflow-visible shadow-small rounded-medium"
      itemClasses={{
        base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
      }}
    >
      <ListboxItem
        key="issues"
        endContent={<ItemCounter number={13} />}
        startContent={
          <IconWrapper className="bg-success/10 text-success">
            <BugIcon className="text-lg " />
          </IconWrapper>
        }
      >
        Issues
      </ListboxItem>
      <ListboxItem
        key="pull_requests"
        endContent={<ItemCounter number={6} />}
        startContent={
          <IconWrapper className="bg-primary/10 text-primary">
            <PullRequestIcon className="text-lg " />
          </IconWrapper>
        }
      >
        Pull Requests
      </ListboxItem>
      <ListboxItem
        key="discussions"
        endContent={<ItemCounter number={293} />}
        startContent={
          <IconWrapper className="bg-secondary/10 text-secondary">
            <ChatIcon className="text-lg " />
          </IconWrapper>
        }
      >
        Discussions
      </ListboxItem>
      <ListboxItem
        key="actions"
        endContent={<ItemCounter number={1} />}
        startContent={
          <IconWrapper className="bg-warning/10 text-warning">
            <PlayCircleIcon className="text-lg " />
          </IconWrapper>
        }
      >
        Actions
      </ListboxItem>
      <ListboxItem
        key="projects"
        endContent={<ItemCounter number={4} />}
        startContent={
          <IconWrapper className="bg-default/50 text-foreground">
            <LayoutIcon className="text-lg " />
          </IconWrapper>
        }
      >
        Projects
      </ListboxItem>
      <ListboxItem
        key="license"
        endContent={<span className="text-small text-default-400">KMUTT</span>}
        startContent={
          <IconWrapper className="bg-danger/10 text-danger dark:text-danger-500">
            <BookIcon />
          </IconWrapper>
        }
      >
        License
      </ListboxItem>
    </Listbox>
    </div>
  );
}