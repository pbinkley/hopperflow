class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.string :basename
      t.string :extension
      t.integer :width
      t.integer :height
      t.integer :size
      t.references :directory, index: true

      t.timestamps
    end
  end
end
