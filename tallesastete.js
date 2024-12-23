// Función para cargar los objetos del localStorage al cargar la página
function loadObjects(filter = '') {
    const listItems = document.getElementById('list-items');
    const objects = JSON.parse(localStorage.getItem('objects')) || []; // Recuperar objetos o un array vacío

    // Limpiar la lista antes de volver a cargar los objetos
    listItems.innerHTML = '';

    // Filtrar los objetos según el filtro de búsqueda
    const filteredObjects = objects.filter(obj => obj.name.toLowerCase().includes(filter.toLowerCase()));

    filteredObjects.forEach((obj, filteredIndex) => {
        const li = document.createElement('li');
        li.textContent = `${obj.name} - Cantidad: ${obj.quantity}`; // Mostrar nombre y cantidad

        // Crear botón de eliminación
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = () => {
            deleteObject(filteredIndex, objects); // Pasar el índice del objeto filtrado y el arreglo original
        };

        // Crear botón de edición
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit-button');
        editButton.onclick = () => {
            editObject(filteredIndex, objects); // Pasar el índice del objeto filtrado y el arreglo original
        };

        li.appendChild(deleteButton);
        li.appendChild(editButton);
        listItems.appendChild(li);
    });
}

// Función para guardar el objeto en localStorage
function saveObject(name, quantity) {
    const objects = JSON.parse(localStorage.getItem('objects')) || []; // Recuperar objetos o un array vacío
    objects.push({ name, quantity }); // Agregar nuevo objeto
    localStorage.setItem('objects', JSON.stringify(objects)); // Guardar en localStorage
    loadObjects(); // Recargar la lista de objetos
}

// Función para eliminar un objeto
function deleteObject(filteredIndex, objects) {
    objects.splice(filteredIndex, 1); // Eliminar el objeto en la posición dada
    localStorage.setItem('objects', JSON.stringify(objects)); // Guardar la lista actualizada en localStorage
    loadObjects(); // Recargar la lista de objetos
}

// Función para editar un objeto
function editObject(filteredIndex, objects) {
    const obj = objects[filteredIndex]; // Obtener el objeto original

    // Llenar el campo de cantidad con el valor actual y mantener el nombre visible
    document.getElementById('object-name').value = obj.name;
    document.getElementById('object-name').disabled = true; // Deshabilitar el campo de nombre para no editar
    document.getElementById('object-quantity').value = obj.quantity;

    // Guardar el índice del objeto en el formulario para usarlo al actualizar
    document.getElementById('object-form').dataset.editIndex = filteredIndex;

    // Cambiar el comportamiento del formulario a actualización
    const form = document.getElementById('object-form');
    form.onsubmit = function(event) {
        event.preventDefault(); // Evita el envío del formulario por defecto
        updateObject(filteredIndex, objects); // Llamar a la función de actualización
    };
}

function updateObject(filteredIndex, objects) {
    const objectQuantity = document.getElementById('object-quantity').value;

    // Verificar si la cantidad es válida
    if (isNaN(objectQuantity) || objectQuantity <= 0) {
        alert('Guardado');
        return;
    }

    // Actualizar el objeto en el índice correspondiente
    objects[filteredIndex].quantity = objectQuantity;
    localStorage.setItem('objects', JSON.stringify(objects));

    // Limpiar los campos del formulario
    const form = document.getElementById('object-form');
    document.getElementById('object-name').value = '';
    document.getElementById('object-quantity').value = '';
    document.getElementById('object-name').disabled = false; // Habilitar el campo de nombre
    delete form.dataset.editIndex; // Eliminar el índice de edición

    // Recargar la lista de objetos
    loadObjects();
}


// Función para manejar el evento del campo de búsqueda
function handleSearch(event) {
    const filter = event.target.value;
    loadObjects(filter); // Cargar los objetos filtrados
}

// Cargar objetos al inicio
loadObjects();

document.getElementById('object-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el comportamiento por defecto

    const objectName = document.getElementById('object-name').value.trim();
    const objectQuantity = document.getElementById('object-quantity').value.trim();

    // Validación de entrada
    if (!objectName || isNaN(objectQuantity) || objectQuantity <= 0) {
        alert('Guardado, gracias');
        return;
    }

    const form = document.getElementById('object-form');
    const editIndex = form.dataset.editIndex;

    const objects = JSON.parse(localStorage.getItem('objects')) || [];

    if (editIndex !== undefined && editIndex !== null) {
        // Actualizar el objeto si está en modo edición
        updateObject(editIndex, objects);
    } else {
        // Agregar un nuevo objeto si no está en modo edición
        saveObject(objectName, objectQuantity);
    }

    // Limpiar el formulario después de agregar o editar
    document.getElementById('object-name').value = '';
    document.getElementById('object-quantity').value = '';
    document.getElementById('object-name').disabled = false; // Asegurar que el campo de nombre esté habilitado
    delete form.dataset.editIndex; // Eliminar cualquier índice de edición
});


// Vincular el campo de búsqueda con la función de búsqueda
document.getElementById('search-bar').addEventListener('input', handleSearch);
