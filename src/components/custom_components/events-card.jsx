import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EventsCard = ({ event, index, handleDeleteEvent, handleEditEvent }) => {
  return (
    <div>
      <Card
        key={event.id}
        className="shadow-lg rounded-xl bg-white text-black hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 max-w-xs mx-auto"
        style={{
          minHeight: "250px", // Set a minimum height for cards
          height: "auto", // Allow the card to adjust height based on content
        }}
      >
        <CardHeader>
          <h2 className="text-xl font-semibold text-indigo-600">
            {event.name}
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">
            {event.startTime} - {event.endTime}
          </p>
          <p className="mt-2 text-gray-600 break-words">{event.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={() => handleDeleteEvent(index)}
            className="bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
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
    </div>
  );
};

export default EventsCard;
