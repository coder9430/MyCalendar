import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { isValid, parseISO, format, addMonths } from "date-fns";
import { v4 as uuidv4 } from "uuid"; // Importing uuid to generate unique IDs
import EventsCard from "@/components/custom_components/events-card";

const EventsPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    startTime: "",
    endTime: "",
    description: "",
    editIndex: null,
    id: null, // Add an ID field to the new event object
  });
  const [showDialog, setShowDialog] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Load events from localStorage when the date changes
  useEffect(() => {
    if (!date) return;
    const storedEvents = localStorage.getItem(date);
    if (storedEvents) {
      try {
        console.log("Loaded events:", storedEvents);
        setEvents(JSON.parse(storedEvents));
      } catch (error) {
        console.error("Error parsing localStorage data", error);
        setEvents([]);
      }
    }
  }, [date]);

  useEffect(() => {
    if (!date || events.length === 0) return;

    try {
      console.log("Saving events to localStorage", events);
      localStorage.setItem(date, JSON.stringify(events));
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  }, [events, date]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const checkEventOverlap = (startTime, endTime, excludeId = null) => {
    return events.some(
      (event) =>
        event.id !== excludeId && // Ignore the event with the ID we are editing
        ((startTime >= event.startTime && startTime < event.endTime) ||
          (endTime > event.startTime && endTime <= event.endTime) ||
          (startTime <= event.startTime && endTime >= event.endTime))
    );
  };

  const isValidTimeRange = (startTime, endTime) => {
    return startTime < endTime;
  };

  const handleAddOrEditEvent = () => {
    if (!isValidTimeRange(newEvent.startTime, newEvent.endTime)) {
      alert("Invalid time range. Start time must be earlier than end time.");
      return;
    }

    if (checkEventOverlap(newEvent.startTime, newEvent.endTime, newEvent.id)) {
      alert(
        "This event overlaps with an existing event. Please choose a different time."
      );
      return;
    }

    if (newEvent.editIndex !== null) {
      const updatedEvents = [...events];
      updatedEvents[newEvent.editIndex] = {
        name: newEvent.name,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        description: newEvent.description,
        id: newEvent.id, // Keep the unique ID intact
      };
      setEvents(updatedEvents);
    } else {
      setEvents((prev) => [...prev, { ...newEvent, id: uuidv4() }]); // Generate a unique ID for new events
    }

    setNewEvent({
      name: "",
      startTime: "",
      endTime: "",
      description: "",
      editIndex: null,
      id: null,
    });
    setShowDialog(false);
  };

  const handleDeleteEvent = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
  };

  const handleEditEvent = (index) => {
    const eventToEdit = events[index];
    setNewEvent({
      name: eventToEdit.name,
      startTime: eventToEdit.startTime,
      endTime: eventToEdit.endTime,
      description: eventToEdit.description,
      editIndex: index,
      id: eventToEdit.id, // Set the ID of the event being edited
    });
    setShowDialog(true);
  };

  useEffect(() => {
    const currentDate = parseISO(date);
    const newMonthDate = addMonths(currentDate, 1);
    const newDate = format(newMonthDate, "yyyy-MM-dd");

    if (!isValid(parseISO(newDate))) {
      navigate(`/events/${format(newMonthDate, "yyyy-MM-01")}`);
    }
  }, [date, navigate]);

  const filteredEvents = events.filter((event) => {
    const keyword = searchKeyword.toLowerCase();
    return (
      event.name.toLowerCase().includes(keyword) ||
      event.description.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-white text-black p-6 w-screen">
      <header className="flex justify-between items-start mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="bg-white text-black hover:bg-gray-200 rounded-lg p-3"
        >
          Back
        </Button>
      </header>
      <header className="flex justify-center items-center mb-6">
      <h1 className="text-5xl font-serif font-bold text-gray-800 tracking-wide">
        EVENTS FOR {date}
        </h1>
      </header>

      <div className="mb-6 max-w-md mx-auto text-black">
        <Input
          placeholder="Search events"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full p-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <p className="text-center text-lg col-span-3">
            No events found for this search.
          </p>
        ) : (
          filteredEvents.map((event, index) => (
            <EventsCard event={event} index={index} handleEditEvent={handleEditEvent} handleDeleteEvent={handleDeleteEvent} />
          ))
        )}
      </div>

      <div className="mt-8 text-center">
        <Button
          variant="primary"
          onClick={() => setShowDialog(true)}
          className="bg-green-500 text-white rounded-full px-6 py-3 shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Add Event
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogTitle className="text-xl font-semibold">
            {newEvent.editIndex !== null ? "Edit Event" : "Add New Event"}
          </DialogTitle>
          <DialogDescription>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddOrEditEvent();
              }}
              className="space-y-4"
            >
              <Input
                name="name"
                value={newEvent.name}
                onChange={handleInputChange}
                placeholder="Event Name"
                required
                className="w-full p-3 rounded-lg shadow-lg"
              />
              <div className="flex space-x-4">
                <Input
                  type="time"
                  name="startTime"
                  value={newEvent.startTime}
                  onChange={handleInputChange}
                  placeholder="Start Time"
                  required
                  className="w-1/2 p-3 rounded-lg shadow-lg"
                />
                <Input
                  type="time"
                  name="endTime"
                  value={newEvent.endTime}
                  onChange={handleInputChange}
                  placeholder="End Time"
                  required
                  className="w-1/2 p-3 rounded-lg shadow-lg"
                />
              </div>
              <Textarea
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                placeholder="Event Description"
                
                className="w-full p-3 rounded-lg shadow-lg"
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowDialog(false)}
                  className="rounded-lg px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-green-500 text-white rounded-lg px-6 py-2 shadow-md hover:bg-green-600"
                >
                  {newEvent.editIndex !== null ? "Update" : "Add"}
                </Button>
              </DialogFooter>
            </form>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsPage;

