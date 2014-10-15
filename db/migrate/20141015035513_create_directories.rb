class CreateDirectories < ActiveRecord::Migration
  def change
    create_table :directories do |t|
      t.string :dirpath

      t.timestamps
    end
  end
end
