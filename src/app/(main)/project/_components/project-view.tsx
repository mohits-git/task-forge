'use client';

import React, { useEffect, useState } from "react";
import { updateLanesOrder, updateTicketsOrder } from "@/lib/queries";
import {
  LaneDetail,
  TicketWithAssigned,
} from "@/lib/types";
import { Project } from "@prisma/client";
import { Flag, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import ProjectLane, { ProjectLaneOverlay } from "./project-lane";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { TicketOverlay } from "./project-ticket";

type Props = {
  projectId: string;
  project: Project;
  lanes: LaneDetail[];
}

const ProjectView: React.FC<Props> = ({ projectId, project, lanes }) => {
  const router = useRouter();
  const [allLanes, setAllLanes] = useState<LaneDetail[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTicket, setActiveTicket] = useState<{ id: string; containerId: string; } | null>(null);

  const detectSensor = () => {
    const isWebEntry = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return !isWebEntry ? PointerSensor : TouchSensor;
  }
  const sensors = useSensors(
    useSensor(detectSensor(), {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [hash, setHash] = useState(window.location.hash.substring(1));

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash.substring(1));
    }
    window.onhashchange = onHashChange;
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const lane = document.getElementById(`${hash}`);
    if (lane) {
      lane.scrollIntoView({ behavior: "smooth", block: "center", inline: "start", });
    }
  }, [hash]);

  useEffect(() => {
    setAllLanes(lanes);
  }, [lanes]);

  const ticketsFromAllLanes: TicketWithAssigned[] = [];

  lanes.forEach(item => {
    item.Tickets.forEach(i => ticketsFromAllLanes.push(i));
  });

  const [allTickets, setAllTickets] = useState(ticketsFromAllLanes);

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const containerId: string = active.data.current?.sortable?.containerId;
    if (containerId === 'lanes')
      setActiveId(active?.id?.toString());
    else {
      setActiveTicket({ id: active?.id?.toString(), containerId: containerId });
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const containerId: string = active.data.current?.sortable?.containerId;
    if (containerId === 'lanes') {
      const source = allLanes.findIndex(lane => lane.id === active?.id);
      const destination = allLanes.findIndex(lane => lane.id === over?.id);
      if (source != destination) {
        const newLanes = [...allLanes]
          .toSpliced(source, 1)
          .toSpliced(destination, 0, allLanes[source])
          .map((lane, idx) => {
            return { ...lane, order: idx }
          })
        setAllLanes(newLanes)
        updateLanesOrder(newLanes)
      }
    }
    else {
      const sourceContainerId: string = active.data?.current?.sortable?.containerId;
      const destContainerId: string = over?.data?.current?.sortable?.containerId;

      let newLanes = [...allLanes];
      const originLane = newLanes.find((lane) => lane.id === sourceContainerId);
      const destinationLane = newLanes.find((lane) => lane.id === destContainerId);

      if (!originLane || !destinationLane) return;

      if (containerId === destContainerId) {
        const sourceLane = allLanes.find(lane => lane.id === sourceContainerId)!;
        const source = sourceLane.Tickets.findIndex(ticket => ticket.id === active?.id);
        const destination = sourceLane.Tickets.findIndex(ticket => ticket.id === over?.id);

        const newOrderedTickets = [...originLane.Tickets]
          .toSpliced(source, 1)
          .toSpliced(destination, 0, originLane.Tickets[source])
          .map((item, idx) => {
            return { ...item, order: idx }
          });

        const newOrderedTicketsLanes = newLanes.map((lane) => {
          if (lane.id === originLane.id) {
            lane.Tickets = newOrderedTickets;
          }
          return lane;
        });
        setAllLanes(newOrderedTicketsLanes);
        updateTicketsOrder(newOrderedTickets);
        setActiveTicket(null);
        router.refresh();
      }
      else {
        const sourceLane = allLanes.find(lane => lane.id === sourceContainerId)!;
        const destinationLane = allLanes.find(lane => lane.id === destContainerId)!;

        if (destContainerId === 'lanes') {
          let newLanes = [...allLanes];
          const originLane = newLanes.find(
            (lane) => lane.id === sourceContainerId
          )!;
          const destLaneId = over?.id;
          const destinationLane = newLanes.find(
            (lane) => lane.id === destLaneId
          )!;

          const source = originLane.Tickets.findIndex(ticket => ticket.id === active?.id);

          const [currentTicket] = originLane.Tickets.splice(source, 1);

          originLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx
          });

          destinationLane.Tickets.push({
            ...currentTicket,
            laneId: destContainerId,
          });

          destinationLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx
          });
          const newOrderedTicketsLanes = newLanes.map((lane) => {
            if (lane.id === originLane.id) {
              lane.Tickets = originLane.Tickets;
            }
            if (lane.id === destinationLane.id) {
              lane.Tickets = destinationLane.Tickets;
            }
            return lane;
          });
          setAllLanes(newOrderedTicketsLanes);
          updateTicketsOrder([
            ...destinationLane.Tickets,
            ...originLane.Tickets,
          ]);
          router.refresh();
        } else {

          const source = sourceLane.Tickets.findIndex(ticket => ticket.id === active?.id);
          const destination = destinationLane.Tickets.findIndex(ticket => ticket.id === over?.id);

          const [currentTicket] = originLane.Tickets.splice(source, 1);

          originLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx
          });

          destinationLane.Tickets.splice(destination, 0, {
            ...currentTicket,
            laneId: destContainerId,
          });

          destinationLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx
          });

          const newOrderedTicketsLanes = newLanes.map((lane) => {
            if (lane.id === originLane.id) {
              lane.Tickets = originLane.Tickets;
            }
            if (lane.id === destinationLane.id) {
              lane.Tickets = destinationLane.Tickets;
            }
            return lane;
          });
          setAllLanes(newOrderedTicketsLanes);
          updateTicketsOrder([
            ...destinationLane.Tickets,
            ...originLane.Tickets,
          ]);
          router.refresh();
        }
      }
    }
    setActiveId(null);
    setActiveTicket(null);
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const containerId: string = active.data.current?.sortable?.containerId;
    if (containerId !== 'lanes') {
      const sourceContainerId: string = active.data?.current?.sortable?.containerId;
      const destContainerId: string = over?.data?.current?.sortable?.containerId;

      if (destContainerId === 'lanes') {
        let newLanes = [...allLanes];
        const originLane = newLanes.find(
          (lane) => lane.id === sourceContainerId
        )!;
        const destLaneId = over?.id;
        const destinationLane = newLanes.find(
          (lane) => lane.id === destLaneId
        )!;

        const source = originLane.Tickets.findIndex(ticket => ticket.id === active?.id);

        const [currentTicket] = originLane.Tickets.splice(source, 1);

        originLane.Tickets.forEach((ticket, idx) => {
          ticket.order = idx
        });

        destinationLane.Tickets.push({
          ...currentTicket,
          laneId: destLaneId?.toString()!,
        });

        destinationLane.Tickets.forEach((ticket, idx) => {
          ticket.order = idx
        });
        const newOrderedTicketsLanes = newLanes.map((lane) => {
          if (lane.id === originLane.id) {
            lane.Tickets = originLane.Tickets;
          }
          if (lane.id === destinationLane.id) {
            lane.Tickets = destinationLane.Tickets;
          }
          return lane;
        });
        setAllLanes(newOrderedTicketsLanes);
        updateTicketsOrder([
          ...destinationLane.Tickets,
          ...originLane.Tickets,
        ]);
        router.refresh();
        return;
      }

      let newLanes = [...allLanes];
      const originLane = newLanes.find(
        (lane) => lane.id === sourceContainerId
      );
      const destinationLane = newLanes.find(
        (lane) => lane.id === destContainerId
      );

      if (!originLane || !destinationLane) return;

      if (containerId !== destContainerId) {
        const source = originLane.Tickets.findIndex(ticket => ticket.id === active?.id);
        const destination = destinationLane.Tickets.findIndex(ticket => ticket.id === over?.id);

        const [currentTicket] = originLane.Tickets.splice(source, 1);

        originLane.Tickets.forEach((ticket, idx) => {
          ticket.order = idx
        });

        destinationLane.Tickets.splice(destination, 0, {
          ...currentTicket,
          laneId: destContainerId,
        });

        destinationLane.Tickets.forEach((ticket, idx) => {
          ticket.order = idx
        });

        const newOrderedTicketsLanes = newLanes.map((lane) => {
          if (lane.id === originLane.id) {
            lane.Tickets = originLane.Tickets;
          }
          if (lane.id === destinationLane.id) {
            lane.Tickets = destinationLane.Tickets;
          }
          return lane;
        });
        setAllLanes(newOrderedTicketsLanes);
        updateTicketsOrder([
          ...destinationLane.Tickets,
          ...originLane.Tickets,
        ]);
        router.refresh();
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      autoScroll={{ acceleration: 100 }}
    >
      <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-automation-zoom-in">
        <SortableContext
          id="lanes"
          items={allLanes}
          strategy={horizontalListSortingStrategy}
        >
          <div
            className="flex mt-4 h-[calc(100vh-86px)] overflow-x-scroll scrollbar gap-4 relative"
          >
            {allLanes.map((lane) => (
              <div
                key={lane.id.toString()}
                id={lane.id.toString()}
              >
                <ProjectLane
                  allTickets={allTickets}
                  setAllTickets={setAllTickets}
                  projectId={projectId}
                  tickets={lane.Tickets}
                  laneDetails={lane}
                />
              </div>
            ))}
            <DragOverlay dropAnimation={null}>
              {activeId && (
                <ProjectLaneOverlay
                  name={allLanes.find(lane => lane.id === activeId)?.name!}
                />
              )}
              {activeTicket && (
                <TicketOverlay
                  ticket={allTickets.find(ticket => ticket.id === activeTicket.id)!}
                />
              )}
            </DragOverlay>
          </div>
        </SortableContext>
        {allLanes.length === 0 && (
          <div className="flex items-center justify-center w-full flex-col">
            <div className="opacity-100">
              <Flag
                width="100%"
                height="100%"
                className="text-muted-foreground"
              />
            </div>
          </div>
        )}
      </div>
    </DndContext>
  )
}

export default ProjectView;
