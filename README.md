# Count2Many
Exploring Redux by overdoing the standard "simple counter" example a bit

<img src="counterUI.png" alt="counterUI" width="300"/>

## Project why?
This is just a fun little project to brush up my Redux skills and hits all the main points:

- actions
- action creators
- async thunk action creators
- reducers
- middleware
- store
- dispatch
- connect

It is interesting to note the difference between the new "standard way" to build Redux applications that the Redux page recommends (Immer library, createSlice, createReducer, etc.) and most projects "in the wild" created before the latest releases.

In addition to all the Redux code, there's some of the common React stuff:

- react router
- hooks
- function components
- render prop pattern
- even checked out the Downshift library (didn't end up using it though)

## Project what?

This lets you create and name as many counters as you like and persist them to a database (currently a simple file write with PHP back-end) by clicking the save button - enjoy the progress indicator :)

You can also view each counter on its own page by clicking its name then remove them when you are done.

## Project where?

I should have this up on my site for a live demo soon.
