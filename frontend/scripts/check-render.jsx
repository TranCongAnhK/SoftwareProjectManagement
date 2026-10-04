import React from 'react';
import {renderToString} from 'react-dom/server';
import {PagesView} from '../src/app/PagesView.jsx';
import {AuthView} from '../src/features/auth/AuthView.jsx';
import {freshDemoData} from '../src/shared/demo/freshDemoData.js';
import {freshRealData} from '../src/shared/api/initialData.js';
import {freshSample} from '../src/shared/demo/freshSample.js';
import {demoAccounts} from '../src/shared/demo/accounts.js';
import {allowedPages} from '../src/shared/config/navigation.js';
let count=0;
for(const role of ['ADMIN','PT','MEMBER']) {
 for(const demo of [true,false]) {
 const ctx={user:{...demoAccounts[role],demo},data:demo?freshDemoData():freshRealData(),sample:freshSample(),setSample:()=>{},setData:()=>{},go:()=>{},flash:()=>{},reload:()=>{},api:()=>{}};
 for(const page of allowedPages[role]) {const html=renderToString(<PagesView page={page} ctx={ctx}/>);if(!html.length)throw Error(role+' '+page);count++}
}
}
renderToString(<AuthView onLogin={()=>{}}/>);
console.log('Rendered '+count+' role/page combinations and login view successfully.');
