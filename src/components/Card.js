import React, { useRef, useState } from 'react'
import { useDrag } from 'react-dnd';

function Card({id,listId,data,cards,setCards,overlayRef}) {
  const inputRef = useRef(null);
  const btnRef = useRef(null);
  const btn1Ref = useRef(null);
  const btn2Ref = useRef(null);
  const [isEditing , setIsEditing] = useState(false);
    function handleEnter() {
        if(isEditing) return;
        btnRef.current.classList.remove("hidden");
      }
      function updateLocalStorageCard(cards){
        localStorage.setItem('cards', JSON.stringify(cards));
      }
      function handleHover(){
        btn1Ref.current.classList.remove("hidden");
        btn2Ref.current.classList.remove("hidden");
      }
      function handlel(){
        btn1Ref.current.classList.add("hidden");
        btn2Ref.current.classList.add("hidden");
      }
      function handleDelete(){
        cards = cards.filter((card)=>(card.id !== id));
        setCards(cards);
        updateLocalStorageCard(cards);
      }
      function handleEdit(){
        setIsEditing(true);
        btnRef.current.classList.add("hidden");
        inputRef.current.contentEditable = true;
        inputRef.current.focus();
        inputRef.current.style.width = '100%';
        overlayRef.current.style.display = 'block';
      }
      function handleEditing(){
        if(inputRef.current.textContent === '')return;
        const ncards = cards.map((card)=>{
          if(card.id === id) return {...card,data:inputRef.current.textContent};
          return card;
        });
        setCards(ncards);
        updateLocalStorageCard(ncards);
        inputRef.current.contentEditable = false;
        overlayRef.current.style.display = 'none';
        inputRef.current.style.width = '85%';
        setIsEditing(false);
      }

      // dnd
      const [{ isDragging }, drag] = useDrag(() => ({
        type: 'task',
        item: {
            id: id,
            listId: listId,
            data:data,
        },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        })
      }));
  return (
        <div key={id} ref={drag} className={isEditing?'card zInd':'card'}
        style={{opacity: `${isDragging? '25%' : '100%'}`}}
         onMouseEnter={handleEnter}
            onMouseLeave={()=>(btnRef.current.classList.add("hidden"))}>
                <div ref={inputRef} className='cardData'>{data}</div>
            <button ref={btnRef} key={id} className='cardBtn hidden' onClick={handleHover} onMouseLeave={handlel}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" width={"20px"}>
                <path fillRule="evenodd" d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
              </svg>
              <div ref={btn1Ref} className='action edit hidden' onClick={handleEdit}>Edit</div>
              <div ref={btn2Ref} className='action delete hidden' onClick={handleDelete}>Delete</div>
            </button>
            {isEditing && <button className='addcardbtn' onClick={handleEditing}
            style={{position:"absolute",left:"0",top:"115%"}}>Edit</button>}
          </div>
  )
}

export default Card
