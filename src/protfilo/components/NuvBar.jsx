import React, { useState } from 'react'


const Button = (p) => {
  return (
    <div> 
      <button className="p-2 text-white" onClick={p.onClick}>{p.titel}</button>   
    </div>
  )
}

const NuvBar = ({setSection}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen((prev) => !prev);

  return (
    <>
    <button className={ `fixed top-5 right-5 z-50 p-2 transition-all duration-500 ease-in-out ${open ? "text-white" : "text-black"}`} onClick={handleClick}>menu</button>
    <div className={`fixed top-0 right-0 bg-black h-screen transition-all duration-500 ease-in-out ${open ? "w-20" : "w-0"}`}>
        <Button onClick={() => setSection(0)} titel="about"/>
        <Button onClick={() => setSection(1)} titel="projects"/>  
        <Button onClick={() => setSection(2)} titel="skills"/>
        <Button onClick={() => setSection(3)} titel="contact"/>
    </div>
    </>
  )
}

export default NuvBar