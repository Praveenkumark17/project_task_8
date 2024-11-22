import React, { useEffect, useState } from "react";
import './crud.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Crud() {

    const [users,setUser] = useState([]);
    const [input,setInput] = useState({
        userId:'',
        title:'',
        completed:false,
    });
    const [updatebtn,setUpdatebtn] = useState(false);

    useEffect(()=>{
        fetch('https://jsonplaceholder.typicode.com/todos')
        .then((response)=>response.json())
        .then(res=>setUser(res));
    },[])

    const onCreate = () =>{
        setInput({
            userId:'',
            completed:false,
            title:'',
        })
    }

    const onUpdatevalue = (e) =>{
        const {name,checked,type,value} = e.target;

        setInput(pre=>{return{...pre,[name]:type==='checkbox'?checked:value}})

    }

    //Add Function

    const onPushvalue = (e) => {
        e.preventDefault();
    
        if (input.userId && input.title) {
            
            const newId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;
    
            // const data = { ...input, id: newId };

            console.log('id:',newId)
    
            console.log("final data:", input);
    
            fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                body: JSON.stringify(input), 
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                }
            })
            .then((res) => res.json())
            .then((response) => {
                const updatedResponse = {...response,id:newId};
                setUser((prev) => {
                    const updateUser = [...prev,updatedResponse];
                    console.log('updated data:', updateUser);
                    return updateUser;
                });
                toast.success('User Added Successfully');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    
            setInput({
                userId: '',
                completed: false,
                title: ''
            });
        }
    };  
    
    const onFetchvalue = (id) =>{

        console.log('sepreate id:',id);

        const fetchcurrentdata = users.find((user)=>user.id===id);
        setInput(fetchcurrentdata);

        setUpdatebtn(true);
    }

    const onClose = () =>{
        setUpdatebtn(false);
    }

    //Update Function

    const onPutvalue = (e) => {
        e.preventDefault();
    
        console.log("onput loading....")
        if(input.id<=200){
            fetch(`https://jsonplaceholder.typicode.com/todos/${input.id}`, {
                method: 'PUT',
                body: JSON.stringify(input),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
            })
            .then((res) => res.json())
            .then((response) => {
                const updatedUsers = users.map(user =>
                    user.id === response.id ? response : user
                );
                setUser(updatedUsers); 
                setUpdatebtn(false); 
                setInput({
                    userId: '',
                    title: '',
                    completed: false,
                });
                toast.info('User Updated Successfully');
            })
            .catch((error) => {
                console.error('Error updating data:', error);
            });
        }else{
            const updatedUsers = users.map(user => user.id === input.id ? input : user );
            setUser(updatedUsers);
            setUpdatebtn(false); 
            setInput({
                userId: '',
                title: '',
                completed: false,
            });
        }
    };


    //Delete Function

    const onDeletevlaue = (id) =>{
        fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: 'delete',
            body: JSON.stringify(input),
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
        })
        .then((res) => res.json())
        .then((response) => {
            setUser((users)=>{
                return users.filter(user=>user.id !==id)
              });
            toast.error('User data deleted');
        })
        .catch((error) => {
            console.error('Error updating data:', error);
        });
    }
    

  return (
    <>
      <div className="container mt-4">
        <ToastContainer position="top-center" autoClose="2000"/>
        <div className="d-flex justify-content-between align-items-center">
          <p className="text-dark fs-4 fw-semibold">Users</p>
          <div className="modal fade" id="exampleModal" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Add Users</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={onPushvalue}>
                        <div className="modal-body">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">User Id</span>
                            <input type="text" className="form-control" placeholder="UserId" name="userId" value={input.userId} onChange={onUpdatevalue} aria-label="UserId" aria-describedby="basic-addon1"/>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon2">Title</span>
                            <input type="text" className="form-control" placeholder="Title" name="title" value={input.title} onChange={onUpdatevalue} aria-label="Title" aria-describedby="basic-addon1"/>
                        </div>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" name="completed" onChange={onUpdatevalue} checked={input.completed}/>
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Task Completed!!</label>
                        </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                            {updatebtn?
                            <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={onPutvalue}>Update User</button>:
                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Add User</button>
                            }
                        </div>
                    </form>
                </div>
            </div>
          </div>
          <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={onCreate}>Create</button>
        </div>
        <table className="table table-light table-striped mt-3 table-hover">
          <thead>
            <tr className="text-center">
              <th>ID</th>
              <th>USER_ID</th>
              <th>TITLE</th>
              <th>COMPLETED</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {users.map((data,index)=>(
                index>=190?<tr className="text-center" key={index+1}>
                <td>{data.id}</td>
                <td>{data.userId}</td>
                <td>{data.title}</td>
                <td className="fs-3">{data.completed?<i class="bi bi-check-circle text-success"></i>:<i class="bi bi-x-circle text-danger"></i>}</td>
                <td><button className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>onFetchvalue(data.id)}>Edit</button>
                <button className="btn btn-outline-danger ms-2" onClick={()=>onDeletevlaue(data.id)}>Delete</button></td>
            </tr>:null
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
