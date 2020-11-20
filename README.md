# Custom Events

## About

Custom_Events is a class to create and manage custom events, handlers and listeners.

## Installation

Copy file [file](./Custom_Events.ts) into the src folder of your project and import the class Custom_Events

```typescript
import { Custom_Events } from "./PathToFile/Custom_Events";
```

## Usage

### Add a event listener and save a reference to the event handler

```typescript
let eventHandler = Custom_Events.addEventListener("EventName", (data)=>{
    console.log(data);
});
```

### Add a event listener without saving a event handler reference

```typescript
Custom_Events.addEventListener("EventName", (data)=>{
    console.log(data);
});
```

### Removes all event listeners from the specified event handler (no event handler reference needed)

```typescript
Custom_Events.removeEventListener("EventName");
```

### Removes a single event listener from the specified event handler

```typescript
Custom_Events.removeEventListener("EventName", eventHandler);
```

### Fire a CustomEvent with the event name and payload

```typescript
Custom_Events.fire("EventName", {message:"Hello World"});
```