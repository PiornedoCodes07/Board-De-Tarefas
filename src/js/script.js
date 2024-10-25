document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    const taskList = document.getElementById("todoList");
    const footerCounter = document.querySelector("footer p");
    let completedCount = 0;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        //Pegando valor dos inputs
        const nameTask = document.getElementById("nameTask").value;
        const labelTask = document.getElementById("labelTask").value;
        const currentDate = new Date().toLocaleDateString();
        if (nameTask.trim() && labelTask.trim()) {
            addTask(nameTask, labelTask, currentDate);
            saveTaskToLocalStorage(nameTask, labelTask, currentDate);
            form.reset();
        }
    });
    //Função adicionar Task
    function addTask(name, label, date, completed = false) {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task");

        const taskDetails = document.createElement("div");
        taskDetails.classList.add("taskDetails");
        if (completed) taskDetails.classList.add("complete");

        const taskTitle = document.createElement("h6");
        taskTitle.textContent = name;
        if (completed) taskTitle.classList.add("completed");

        const divLabelDate = document.createElement('div');
        divLabelDate.classList.add("divLabelDate")

        const taskLabel = document.createElement("span");
        taskLabel.textContent = label;

        const taskDate = document.createElement("p");
        taskDate.textContent = `Criado em: ${date}`;

        divLabelDate.appendChild(taskLabel);
        divLabelDate.appendChild(taskDate);

        taskDetails.appendChild(taskTitle);
        taskDetails.appendChild(divLabelDate);

        const taskButton = document.createElement("div");
        taskButton.classList.add("taskButton");

        const completeButton = document.createElement("button");
        completeButton.textContent = "Concluir";
        completeButton.addEventListener("click", function () {
            taskTitle.classList.add("completed");
            taskDetails.classList.add("complete");

            // Remover o botão e substituir por ícone
            setTimeout(() => {
                taskButton.innerHTML = ''; // Limpar o botão
                const checkIcon = document.createElement("img");
                checkIcon.src = "/src/assets/checked.svg"; // Icone de complete
                checkIcon.alt = "Tarefa Concluída";
                taskButton.appendChild(checkIcon);

                // Aumentar o contador de tarefas concluídas
                completedCount++;
                updateFooterCounter();

                // Remover a tarefa após 2 segundos
                setTimeout(() => {
                    taskItem.remove();
                    saveTasksToLocalStorage(); // Atualizar o LocalStorage
                }, 2000);
            }, 500); // Atraso para a animação antes de mudar o botão
        });

        taskButton.appendChild(completeButton);
        taskItem.appendChild(taskDetails);
        taskItem.appendChild(taskButton);
        taskList.appendChild(taskItem);
    }
    // Função para alterar contador de tarefas
    function updateFooterCounter() {
        footerCounter.textContent = `${completedCount} tarefa${completedCount === 1 ? '' : 's'} concluída${completedCount === 1 ? '' : 's'}`;
    }
    // Função para Salvar Tarefa no Local Storage
    function saveTaskToLocalStorage(name, label, date, completed = false) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ name, label, date, completed });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    // Função para Carregar Tarefas do Local Storage
    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTask(task.name, task.label, task.date, task.completed);
            if (task.completed) completedCount++; // Contar tarefas concluídas ao carregar
        });
        updateFooterCounter(); // Atualizar contador ao carregar
    }

    function saveTasksToLocalStorage() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            const name = li.querySelector('h6').textContent;
            const label = li.querySelector('span').textContent;
            const date = li.querySelector('p').textContent.replace('Criado em: ', '');
            const completed = li.querySelector('h6').classList.contains('completed');
            tasks.push({ name, label, date, completed });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    loadTasksFromLocalStorage();
});
