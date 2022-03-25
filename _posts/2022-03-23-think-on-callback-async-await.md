---
title: 'Think on callback and async/await'
layout: post
tags:
- Web dev
- Technology
- Javascript
---
```js
function callback() {
  return new Promise((resolve, reject) =>{
      setTimeout(()=>{
    console.log("callback");
  },  3000);
  });
}

async function asyncCall() {
  console.log('calling');
  await callback();
  console.log("ABC");
  console.log(123);
}

asyncCall();

// Console log
// calling
// Promise {<pending>}
// callback
// didn't log ABC, 123 beacuse callback didn't resolve(), 
// thus code after await will never run

function callback1() {
  return new Promise((resolve, reject) =>{
      setTimeout(()=>{
    resolve(100);
  },  3000);
  });
}

async function asyncCall() {
  console.log('calling');
  let res = await callback1();
  console.log(res);
  console.log("ABC");
  console.log(123);
  // expected output: "resolved"
}

asyncCall();

// Console log
// calling
// Promise pending
// 100
// ABC
// 123
// logged ABC and 123 because promise(callback1) resolved
// code after await blocked until promise resolved


// in order to no-blocking code after promise
// we should prevent to use await
// but use Promise.then()
//  
async function asyncCall() {
  console.log('calling');
  callback().then(()=>{console.log("then")});
  console.log("ABC");
  console.log(123);
}

asyncCall();
// Console log
// calling
// ABC
// 123
// Promise {<fulfilled>: undefined}
// callback
// then
```