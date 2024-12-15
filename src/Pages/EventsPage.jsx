import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { isValid, parseISO, format, addMonths } from "date-fns";
import { v4 as uuidv4 } from 'uuid'; // Importing uuid to generate unique IDs

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
        (
          (startTime >= event.startTime && startTime < event.endTime) ||
          (endTime > event.startTime && endTime <= event.endTime) ||
          (startTime <= event.startTime && endTime >= event.endTime)
        )
    );
  };

  const handleAddOrEditEvent = () => {
    if (checkEventOverlap(newEvent.startTime, newEvent.endTime, newEvent.id)) {
      alert("This event overlaps with an existing event. Please choose a different time.");
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

    setNewEvent({ name: "", startTime: "", endTime: "", description: "", editIndex: null, id: null });
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
    <div className="min-h-screen bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 text-white p-6 w-screen">
      <header className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="bg-white text-black hover:bg-gray-200 rounded-lg p-3">
          Back
        </Button>
        <h1 className="text-3xl font-bold">Events for {date}</h1>
      </header>

      <div className="mb-6 max-w-md mx-auto">
        <Input
          placeholder="Search events"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full p-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <p className="text-center text-lg">No events found for this search.</p>
        ) : (
          filteredEvents.map((event, index) => (
            <Card key={event.id} className="shadow-lg rounded-xl bg-white text-black hover:shadow-2xl transition-transform duration-300 transform hover:scale-105">
              <CardHeader>
                <h2 className="text-xl font-semibold">{event.name}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {event.startTime} - {event.endTime}
                </p>
                <p className="mt-2 text-gray-600">{event.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" onClick={() => handleDeleteEvent(index)} className="bg-red-500 text-white rounded-lg hover:bg-red-600">
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleEditEvent(index)}
                  className="ml-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                  Edit
                </Button>
              </CardFooter>
            </Card>
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
          <DialogTitle className="text-xl font-semibold">{newEvent.editIndex !== null ? "Edit Event" : "Add New Event"}</DialogTitle>
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
                  required
                  className="p-3 rounded-lg shadow-lg w-full"
                />
                <Input
                  type="time"
                  name="endTime"
                  value={newEvent.endTime}
                  onChange={handleInputChange}
                  required
                  className="p-3 rounded-lg shadow-lg w-full"
                />
              </div>
              <Textarea
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                placeholder="Event Description"
                required
                className="w-full p-3 rounded-lg shadow-lg"
              />
              <DialogFooter>
                <Button variant="secondary" onClick={() => setShowDialog(false)} className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="ml-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                >
                  {newEvent.editIndex !== null ? "Save Changes" : "Add Event"}
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