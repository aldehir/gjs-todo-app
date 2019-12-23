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
  }
})

function main (argv) {
  return (new TodoApp()).run(argv)
}
