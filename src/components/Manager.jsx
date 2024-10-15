import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()

    const [form, setform] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setpasswordArray] = useState([])

    const getPasswords = async() => {
        let req = await fetch("http://localhost:3000/");
        let passwords = await req.json()
        console.log(passwords);
        setpasswordArray(passwords);
    }

    useEffect(() => {
       getPasswords();
    }, [])

    const copyText = (text)=>{
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        navigator.clipboard.writeText(text);
    }

    const showPassword = () => {
        if (ref.current.src.includes("icons/hidden.png")) {
            ref.current.src = "icons/eye.png"
            passwordRef.current.type = "password"
        }
        else {
            ref.current.src = "icons/hidden.png"
            passwordRef.current.type = "text"
        }
    }

    const savePassword = async() => {
        if(passwordArray.find(item=> item.username === form.username && item.site === form.site) !== undefined)
        {
            toast('Username is already taken!',{
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
        }
        else
        {
            setpasswordArray([...passwordArray, {...form, id: uuidv4()}]);
            await fetch("http://localhost:3000/",{method: "POST",headers: {"content-type" : "application/json"}, body: JSON.stringify({...form, id: uuidv4()})})
            // localStorage.setItem("passwords", JSON.stringify([...passwordArray, form]))
            console.log([...passwordArray, form]);
        }
    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const removePassword = async(id)=>{
        let newPasswordArray = passwordArray.filter(item=> item.id !== id);

        setpasswordArray(newPasswordArray);
        await fetch("http://localhost:3000/",{method: "DELETE", headers: {"content-type" : "application/json"}, body: JSON.stringify({id})})

        // localStorage.setItem("passwords", JSON.stringify([]));
    }

    return (
        <><ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition= "Bounce"
        />
        {/* Same as */}
        <ToastContainer/>
            <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div></div>

            <div className="p-2 md:p-0 md:mycontainer">
                <h1 className='text font-bold text-center text-4xl'>
                    <span className='text-green-700'>&lt;</span>
                    Pass
                    <span className='text-green-700'>OP/&gt;</span>
                </h1>

                <p className='text-green-900 text-lg text-center'>Your own Password Manager</p>
                <div className="text-black flex flex-col p-4 gap-8 items-center">
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' className='border border-green-500 rounded-full w-full p-4 py-1' type="text" name='site' />

                    <div className='flex flex-col md:flex-row w-full justify-between gap-8'>
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='border border-green-500 rounded-full w-full p-4 py-1' type="text" name='username' />
                        <div className="relative">
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='border border-green-500 rounded-full w-full p-4 py-1' type="password" name='password' />
                            <span className='absolute right-[3px] top-[4px] cursor-pointer' onClick={showPassword}>
                                <img ref={ref} className='p-1' width={26} src="/icons/eye.png" alt="eye" /></span>
                        </div>
                    </div>



                    <button onClick={savePassword} className='flex gap-2 justify-center items-center bg-green-500 rounded-full px-8 py-2 w-fit border-2 border-green-950'>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover">
                        </lord-icon>
                        Save</button>
                </div>
                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4'>Your passwords</h2>
                    {passwordArray.length === 0 && <div>No passwords to show</div>}
                    {passwordArray.length != 0 && <table className="table-auto w-full rounded-md overflow-hidden">
                        <thead className='bg-green-800 text-white'>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-green-100'>
                            {passwordArray.map((item, index) => {
                                return <tr key={index}>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center'><a href={item.site} target='_blank'>{item.site}</a><img onClick={()=>copyText(item.site)} className='px-1 pt-1 mx-4 size-7 cursor-pointer' src="/icons/copy.svg" alt="" />
                                        </div>
                                    </td>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center'>{item.username} <img onClick={()=>copyText(item.username)} className='px-1 pt-1 mx-4 size-7 cursor-pointer' src="/icons/copy.svg" alt="" /></div>
                                    </td>
                                    <td className=' py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center'>{item.password} <img onClick={()=>copyText(item.password)} className='px-1 pt-1 mx-4 size-7 cursor-pointer' src="/icons/copy.svg" alt="" />
                                        </div>
                                    </td>
                                    <td onClick={()=>removePassword(item.id)} className='py-2 border border-white cursor-pointer'>
                                        <div className="flex justify-center items-center">
                                            <img className='' src="/icons/delete.svg" alt="" />
                                        </div>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>}
                </div>
            </div>
        </>
    )
}

export default Manager