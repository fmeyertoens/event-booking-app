import React from 'react';
import EventItem from './EventListItem/eventListItem';
import './eventList.css';

const eventList = props => {
  const events = props.events.map(event => {
    return <EventItem key={event.id} event={event} onDetail={props.onViewDetail}/>
  });

  return <ul className="event-list">{events}</ul>;
};

export default eventList;