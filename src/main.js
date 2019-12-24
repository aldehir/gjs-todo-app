pkg.initGettext()
pkg.initFormat()

imports.gi.versions = {
  GObject: '2.0',
  Gio: '2.0',
  GLib: '2.0',
  Gtk: '3.0'
}

const { GObject, Gio, GLib, Gtk } = imports.gi

const TodoApp = GObject.registerClass({
  Name: 'TodoApp',
  Extends: Gtk.Application
}, class TodoApp extends Gtk.Application {
  _init () {
    super._init({ application_id: pkg.name })
  }

  vfunc_activate () {
    log('TodoApp started')

    let item = new TodoItem()
    item.connect('notify::state', () => { log('state changed') })
    item.state = TodoItemState.Completed
    log(item)
  }
})

function main (argv) {
  return (new TodoApp()).run(argv)
}

const Count = Symbol('count')

const TodoItemState = {
  Pending: 0,
  Completed: 1,
  [Count]: 2
}

const TodoItem = GObject.registerClass({
  Name: 'TodoItem',
  Extends: GObject.Object,
  Properties: {
    state:
      GObject.ParamSpec.uint(
        'state', 'State', 'state of the todo item',
        GObject.ParamFlags.READWRITE,
        0, TodoItemState[Count], TodoItemState.Pending
      ),
    description:
      GObject.ParamSpec.string(
        'description', 'Description', 'description of the todo item',
        GObject.ParamFlags.READWRITE,
        ''
      )
  }
}, class TodoItem extends GObject.Object {
  _init (opts = {}) {
    super._init(opts)

    this._state = opts.state || TodoItemState.Pending
    this._description = opts.description || ''
  }

  get state () { return this._state }
  set state (v) { this._state = v; this.notify('state') }

  get description () { return this._description }
  set description (v) { this._description = v; this.notify('description') }
})

/**
 * A mechanism to guard against events propagating in a cycle.
 */
class PropagationGuard {
  constructor () {
    this.locked = false
  }

  wrap (func) {
    return (...args) => {
      if (this.locked) return

      try {
        return func(...args)
      } finally {
        this.locked = false
      }
    }
  }

  call (...args) {
    let func = args.slice(-1)
    let newArgs = args.slice(0, -1) || []
    return this.wrap(func)(...newArgs)
  }
}

class TodoItemController {
  constructor (view, model) {
    this.view = view
    this.model = model

    this.guard = new PropagationGuard()
  }

  on_view_checked () {
    this.guard.call(() => {
      this.model.state = (this.view.checked) ?
        TodoItemState.Completed :
        TodoItemState.Pending
    })
  }

  on_model_state_change () {
    this.guard.call(() => {
      this.view.checked = (this.model.state == TodoItemState.Completed)
    })
  }

  connect_view () {
    this.view.connect('checked', () => { this.on_view_checked() })
  }

  connect_model () {
    this.model.connect('notify::state', () => { this.on_model_state_change() })
  }
}

const TodoAppWindow = GObject.registerClass({
  Name: 'TodoAppWindow',
  Extends: Gtk.ApplicationWindow
}, class TodoAppWindow extends Gtk.ApplicationWindow {
  _init (params={}) {
    super._init(params)
  }
})
