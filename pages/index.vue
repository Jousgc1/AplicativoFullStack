<template>
  <div class="container">
    <h1 class="text-center my-4"> List</h1>
    <form @submit.prevent="addTask" class="mb-4">
      <div class="form-group">
        <input v-model="newTask.title" type="text" class="form-control" placeholder="Título" required>
      </div>
      <div class="form-group">
        <input v-model="newTask.description" type="text" class="form-control" placeholder="Descripción" required>
      </div>
      <button type="submit" class="btn btn-primary">Añadir Tarea</button>
    </form>
    <ul class="list-group mb-4">
      <li v-for="task in tasks" :key="task._id" class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <p class="mb-1">{{ task.title }} - <span class="badge badge-secondary">{{ task.status }}</span></p>
          <p class="mb-1">Creado el: {{ new Date(task.createdAt).toLocaleString() }}</p>
          <p class="mb-1">Actualizado el: {{ new Date(task.updatedAt).toLocaleString() }}</p>
        </div>
        <div>
          <button @click="deleteTask(task._id)" class="btn btn-danger btn-sm mr-2">Eliminar</button>
          <button @click="startEditing(task)" class="btn btn-secondary btn-sm">Editar</button>
        </div>
      </li>
    </ul>
    <!-- Condición para cargar el componente de manera diferida -->
    <lazy-component v-if="showLazyComponent"></lazy-component>
    <div v-if="isEditing" class="mt-4">
      <h2>Editar Tarea</h2>
      <form @submit.prevent="updateTask">
        <div class="form-group">
          <input v-model="currentTask.title" type="text" class="form-control" placeholder="Título" required>
        </div>
        <div class="form-group">
          <input v-model="currentTask.description" type="text" class="form-control" placeholder="Descripción" required>
        </div>
        <button type="submit" class="btn btn-primary">Actualizar Tarea</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: [],
      newTask: { title: '', description: '' },
      currentTask: null,
      isEditing: false,
      showLazyComponent: false // Estado para controlar la carga del componente
    };
  },
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/tasks');
    return { tasks: data };
  },
  components: {
    LazyComponent: () => import('@/components/LazyComponent.vue')
  },
  methods: {
    async addTask() {
      const { data } = await this.$axios.post('/tasks', this.newTask);
      this.tasks.push(data);
      this.newTask = { title: '', description: '' };
    },
    async deleteTask(id) {
      await this.$axios.delete(`/tasks/${id}`);
      this.tasks = this.tasks.filter(task => task._id !== id);
    },
    startEditing(task) {
      this.currentTask = { ...task };
      this.isEditing = true;
    },
    async updateTask() {
      const { data } = await this.$axios.put(`/tasks/${this.currentTask._id}`, this.currentTask);
      const index = this.tasks.findIndex(task => task._id === this.currentTask._id);
      this.$set(this.tasks, index, data);
      this.currentTask = null;
      this.isEditing = false;
    }
  },
  mounted() {
    // Simula una condición para cargar el componente de manera diferida
    setTimeout(() => {
      this.showLazyComponent = true;
    }, 2000);
  }
}
</script>
