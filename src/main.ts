import {v4} from 'uuid'
import Toastify from 'toastify-js'

import "toastify-js/src/toastify.css"
import './style.css'
//Con ts puedes especificar el componente <ELEMENTO>
const taskForm = document.querySelector<HTMLFormElement>('#taskForm')
const taskList = document.querySelector<HTMLDivElement>('#taskList')

interface Task{
    id: string;
    title: string;
    description: string;
}

let tasks: Task[] = []

//AGREGAR LAS TAREAS AL ARRAY Y LUEGO AL LOCAL STORAGE
taskForm?.addEventListener('submit', (e) =>{
    e.preventDefault();
    //Seleccion y especificacion de elementos a agregar
    const title = taskForm['title'] as unknown as HTMLInputElement
    const description = taskForm['description'] as unknown as HTMLTextAreaElement

    console.log(title.value)
    console.log(description.value)

    tasks.push({
        title: title.value,
        description: description.value,
        id: v4()
    })
    //JSON STRINGIFY es que pasa los valores del array a string asi localstorage lo interpreta
    localStorage.setItem('tasks', JSON.stringify(tasks))

    Toastify({ //Este coso es pa notificaciones | ESTA REGENIAL PA LO DE READERA
        text: "Task added",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)"
        }
    }).showToast()

    renderTasks(tasks) //Recarga la lista (como si fuera ReactGOD)
    //Resetear valores
    taskForm.reset()
    title.focus()

})

//CARGAR LAS TAREAS (Como si fuera un useEffect)
document.addEventListener('DOMContentLoaded',()=>{
    //En este caso pa no mostrar nada usamos el || '[]' pa asegurar la wea 
    tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    renderTasks(tasks)
})

function renderTasks(tasks: Task[]){
    //El signo de admiracion lo hace como no opcional, esto hace que no se duplique la lista
    taskList!.innerHTML = '' //RESETEA LA LISTA, ahora extrae todo del localstorage

    tasks.forEach(task => {
        const taskElement = document.createElement('div')
        taskElement.className = 'bg-zinc-800 mb-1 p-4 rounded-lg hover:bg-zinc-700 hover:cursor-pointer'

        const header = document.createElement('header')
        header.className = 'flex justify-between'

        const title = document.createElement('span')
        title.innerText = task.title
        title.className = 'font-semibold'
        
        const btnDelete = document.createElement('button')
        btnDelete.className = 'bg-red-500 px-2 py-1 rounded-md'
        btnDelete.innerText = 'Delete'

        btnDelete.addEventListener('click', () => {
            const index=tasks.findIndex(t=>t.id === task.id)
            tasks.splice(index, 1)
            localStorage.setItem('tasks',JSON.stringify(tasks))
            Toastify({ //Task deleted notification
                text: "Task deleted",
                style: {
                    background: "linear-gradient(to right, #d7816a, #bd4f6c)"
                }
            }).showToast()
            renderTasks(tasks)
        })

        header.append(title)
        header.append(btnDelete)

        const description = document.createElement('p')
        description.innerText = task.description

        taskElement.append(header)
        taskElement.append(description)

        const id = document.createElement('p')
        id.innerText = task.id
        id.className = 'text-gray-400 text-xs'
        taskElement.append(id)

        taskList?.append(taskElement)
    });
}