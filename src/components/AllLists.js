import React, { useEffect, useRef, useState } from 'react'
import List from './List'

function AllLists() {
  const [lists,setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const inputRef = useRef(null);
  const [isAdding, setIsAdding] = useState(false);
  function handleAdd(){
    const listTitle = inputRef.current.value;
    inputRef.current.value = '';
    if(listTitle === '') return;
    setLists((prev)=>{
      const newLists = [...prev,{id:Math.random(),title:listTitle}];
      updateLocalStorageList(newLists);
      return newLists;
    });
    setIsAdding(false);
  }
  function updateLocalStorageList(lists){
    localStorage.setItem('lists', JSON.stringify(lists));
  }
  useEffect(()=>{
    if(localStorage.getItem('lists') !== null) {
      setLists(JSON.parse(localStorage.getItem('lists')));
    }
    if(localStorage.getItem('cards') !== null) {
      setCards(JSON.parse(localStorage.getItem('cards')));
    }
  },[])
    
  return (
    <div className='alllists container'>
      {lists.map((list)=>{
        return (<List key={list.id} id={list.id} title={list.title} lists={lists} setLists={setLists}
        cards={cards} setCards={setCards}/>);
      })}
      <div className={isAdding?'list':'hidden'} style={{height:"150px"}}>
        <input type='text' ref={inputRef} style={{width:"100%"}}/>
        <div className='flex'>
          <button className='addcardbtn' onClick={handleAdd}>Add list</button>
        </div>
        <div className='flex'>
          <button onClick={()=>setIsAdding(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" width={"22px"} viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div className={isAdding?'hidden':'addlist'}>
      <button className='addlistbtn' onClick={()=>setIsAdding(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width={"15px"} viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
            <p className='addcard'>Add another list</p>
          </button>
      </div>
    </div>
  )
}

export default AllLists