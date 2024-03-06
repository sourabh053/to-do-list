import React, { useRef, useState } from 'react'
import Card from './Card';
import { useDrop } from 'react-dnd';

function List({ id,title,lists, setLists,cards,setCards }) {
  const inputRef = useRef(null);
  const editRef = useRef(null);
  const deleteRef = useRef(null);
  const overlayRef = useRef(null);
  const titleRef = useRef(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  function updateLocalStorageCard(cards){
    localStorage.setItem('cards', JSON.stringify(cards));
  }
  function updateLocalStorageList(lists){
    localStorage.setItem('lists', JSON.stringify(lists));
  }
  function handleAdd() {
    const cardData = inputRef.current.textContent;
    inputRef.current.textContent = '';
    if (cardData === '') return;
    setCards((prev)=>{
      const newCards = [...prev, { id: Math.random(), listId: id, data: cardData }]
      updateLocalStorageCard(newCards);
      return newCards;   
      });
    setIsAdding(false);
  }
  function handleEnter() {
    editRef.current.classList.remove("hidden");
    deleteRef.current.classList.remove("hidden");
  }
  function handleLeave(){
     editRef.current.classList.add("hidden");
     deleteRef.current.classList.add("hidden");
  }
  function handleDelete() {
    lists = lists.filter((list)=>(list.id !== id));
    setLists(lists);
    setCards((prev)=>{
      const newCards = prev.filter((card)=>card.listId !== id);
      updateLocalStorageCard(newCards);
      return newCards;
    })
    updateLocalStorageList(lists);
  }
  function handleTitleEdit(){
    setIsEditing(true);
    titleRef.current.contentEditable = true;
    titleRef.current.focus();
    titleRef.current.style.zIndex = "2";
    overlayRef.current.style.display = 'block';
  }
  function handleTitleSave(){
    if(titleRef.current.textContent === '') return;
    titleRef.current.contentEditable = false;
    titleRef.current.style.zIndex = "auto";
    overlayRef.current.style.display = 'none';
    setIsEditing(false);
  }

  //dnd
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item)=>{
      addCardToList(item);
      return {droppedId: id};
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));
  function addCardToList(item){
    if(item.listId === id) return;
    // console.log("dropped id=> "+item.id);
    // console.log("dropped listId=> "+item.listId);
    // console.log("dropped data=> "+item.data);
    setCards((prev)=>{
       const newTasks = prev.map((t)=>{
        if(t.id === item.id) return {...t,listId:id};
        return t;
       });
       updateLocalStorageCard(newTasks);
      return newTasks;
    });
  }
  return (
    <div key={id} ref={drop} className={isOver?'list droping':'list'}>
      <div className='title-cont'>
        <h3 ref={titleRef} className='list-title' style={{width:"85%"}}>{title}</h3>
        <button onClick={handleEnter}
            onMouseLeave={handleLeave} style={{position:"relative"}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" width={"20px"}>
            <path fillRule="evenodd" d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
          </svg>
          <div ref={editRef} className='editList hidden' onClick={handleTitleEdit}>Edit title</div>
          <div ref={deleteRef} className='hidden deleteList'onClick={handleDelete}>Delete list</div>
        </button>
        {isEditing && <button className='addcardbtn' onClick={handleTitleSave}
            style={{position:"absolute",top:"110%", zIndex:"2"}}>Edit</button>}
      </div>
      <div>
        {cards.filter((card)=>card.listId === id).map((card) => {
          return (<Card key={card.id} id={card.id} listId={card.listId} data={card.data} 
            cards={cards} setCards={setCards} overlayRef={overlayRef}/>)
        })}
      </div>
      <div id='overlay' ref={overlayRef}></div>
      <div style={{ marginTop: "1rem" }} className={isAdding ? 'hidden' : ''}>
        <button className='addbtn' onClick={()=>setIsAdding(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width={"15px"} viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
          </svg>
          <p className='addcard'>Add a card</p>
        </button>
      </div>
      <div className={isAdding ? '' : 'hidden'} >
        <div className='card' ref={inputRef} contentEditable data-text="Enter text for this card..." style={{ height: "60px" }}></div>
        <div style={{ display: "flex", gap: "5px" }}>
          <button className='addcardbtn' onClick={handleAdd}>Add card</button>
          <button onClick={()=>setIsAdding(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width={"22px"} viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default List