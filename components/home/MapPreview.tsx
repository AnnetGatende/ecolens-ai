"use client";

import dynamic from "next/dynamic";

const PollutionMap = dynamic(

()=>import("@/components/map/PollutionMap"),

{

ssr:false

}

);

export default function MapPreview(){

return(

<section className="py-20 bg-slate-50">

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-5xl font-bold text-center">

Live Pollution Map

</h2>

<p className="text-center text-slate-600 mt-4 mb-10">

Citizen reports visualized in real time using Gemma AI.

</p>

<PollutionMap/>

</div>

</section>

)

}