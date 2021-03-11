var eventBus = new Vue()



Vue.component('add-item', {
  template: `
    <form class="add-item" @submit.prevent="addTask">
      <input type="text" placeholder="Введите задачу" v-model="task"></input>
      <button type="submit">Добавить</button>
    </form>`,
  methods: {
    addTask() {
      eventBus.$emit('new-task', this.task)
    }
  },
  data: function() {
    return {
      task: null
    }
  }
})

Vue.component('todo-list', {
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  // <tr v-for="(task, id) in tasks" v-if="task.done == showDone">
  template: `
  <table class="todo-list">
    <tr><td>ID</td><td>Задача</td><td>Статус</td></tr>
     <tr v-for="(task, id) in filteredTasks" v-if="task.done == showDone || showDone">
      <td>{{ id+1 }}</td>
      <td>{{ task.task }}</td>
      <td class="todo-list__state" @click="changeState(id)">{{ task.done?"Выполнено":"В процессе" }}</td>
    </tr>
  </table>
  `,
  methods: {
    changeState(id) {
      console.log(id)
      this.filteredTasks[id].done = !this.filteredTasks[id].done;
    }
  },
  mounted() {
    eventBus.$on('change-visible', showDone => this.showDone = showDone)
  },
  computed: {
    filteredTasks: function() {
      return this.tasks.filter(task => (this.showDone || task.done == this.showDone));
    }
  },
  data: function() {
    return {
      showDone: false
    }
  }
})

Vue.component('filters', {
  template: `
  <div class="filters">
    <p class="filters__description">Показать выполненные?</p>
    <input name="showDone" type='checkbox' v-model="showDone" @change="changeVisible"></input>
  </div>
  `,
  data: function() {
    return {
      showDone: false
    }
  },
  methods: {
    changeVisible() {
      eventBus.$emit('change-visible', this.showDone)
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    //state: 0 = в процессе, 1 = выполнено
    tasks: [{
        task: "вымыть окна",
        done: true,
      },
      {
        task: "почистить зубы",
        done: false,
      },
      {
        task: "приготовить ужин",
        done: false,
      },
      {
        task: "заправить кровать",
        done: true,
      }
    ]
  },
  mounted() {
    eventBus.$on('new-task', task => this.tasks.push({
      task,
      done: false
    }))
  }
})
