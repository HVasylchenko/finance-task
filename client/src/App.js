import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import {useDispatch, useSelector} from "react-redux";
import { addTodos } from "./toolkitReducer"; 

const socket = io.connect("http://localhost:4000");

function App() {
  const todo = useSelector(state => state.toolkit.todo);
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [newTicker, setNewTicker] = useState([]);
  const [fetchInterval, setFetchInterval] = useState(5);
 
  useEffect(() => {
    socket.emit("FETCH_INTERVAL", fetchInterval );
    socket.emit("start");
    console.log("FETCH_INTERVAL", fetchInterval);
  }, [fetchInterval]);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.emit("start");
    socket.on("ticker", function (response) {
      const res = Array.isArray(response) ? response : [response];
      setNewTicker(res);
      dispatch(addTodos(res));
    });
   
    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      // socket.off("start");
      socket.off("disconnect");
      socket.off("ticker");
      // socket.off("FETCH_INTERVAL");
    };
  }, []);

  return (
    <div className="container m-5 px-80 py-2 bg-light">
      <div>
        <p>Connected: {"" + isConnected}</p>
      </div>
     
      <div className="d-flex justify-content-around">
        {newTicker.map((item, index) => (
          <div key = {`${item.ticker}` + `${item.price}`}className="btn m-2 p-1 bg-white border border-primary border-2 rounded">
            <div className="d-flex justify-content-around mx-1">
              { +item.price > +todo[todo.length - 2][index].price  
              ? <button className="arrow-up btn bg-info text-dark m-1 p-1 ">
                <svg width="16" height="26" viewBox="0 0 24 24" focusable="false" >
                  <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path>
                </svg>
              </button>
              : <button className="arrow-down btn bg-warning text-dark m-1 p-1 ">
                <svg width="16" height="16" viewBox="0 0 24 24" focusable="false" >
                  <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"></path>
                </svg>
              </button>
              }
              <div className="flex-column mx-1">
                <div className="fw-bold">{item.ticker}</div>
                <div>{item.price}</div>
              </div>
              <div className="flex-column mx-1">
                <div className="">{item.change_percent}</div>
                <div>{item.change}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <p>Set Time Interval (in sec): </p>
        <button className="arrow-up btn bg-info text-dark m-1 p-1 " onClick={() => setFetchInterval(fetchInterval+1)}>
                <svg width="16" height="26" viewBox="0 0 24 24" focusable="false" >
                  <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path>
                </svg>
        </button>
        <span className="btn ">{fetchInterval}</span>
        <button className="arrow-down btn bg-warning text-dark m-1 p-1"  onClick={() => setFetchInterval(fetchInterval-1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" focusable="false" >
                  <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"></path>
                </svg>
              </button>
      </div>
    </div>
  );
}

export default App;
