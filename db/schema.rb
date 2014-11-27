# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141109021117) do

  create_table "directories", force: true do |t|
    t.string   "dirpath"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "documents", force: true do |t|
    t.string   "source"
    t.string   "folder"
    t.integer  "bundleid"
    t.integer  "bundlenum"
    t.integer  "itemid"
    t.integer  "pages"
    t.boolean  "ocr"
    t.boolean  "adjust"
    t.string   "date"
    t.string   "creator"
    t.string   "addressee"
    t.integer  "type"
    t.integer  "copytype"
    t.integer  "script"
    t.boolean  "envelope"
    t.string   "title"
    t.text     "summary"
    t.text     "notes"
    t.string   "tags"
    t.string   "answers"
    t.string   "answeredby"
    t.string   "hascopy"
    t.string   "copyof"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "images", force: true do |t|
    t.string   "basename"
    t.string   "extension"
    t.integer  "width"
    t.integer  "height"
    t.integer  "size"
    t.integer  "directory_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "modify",       default: 0
    t.boolean  "deskew",       default: false
    t.boolean  "split",        default: false
    t.string   "format"
    t.integer  "document_id"
  end

  add_index "images", ["directory_id"], name: "index_images_on_directory_id"
  add_index "images", ["document_id"], name: "index_document_id"

end
