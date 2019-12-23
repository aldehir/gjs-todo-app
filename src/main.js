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
