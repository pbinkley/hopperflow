class CreateDocuments < ActiveRecord::Migration
  def change
    create_table :documents do |t|
      t.string :source
      t.string :folder
      t.integer :bundleid
      t.integer :bundlenum
      t.integer :itemid
      t.integer :pages
      t.boolean :ocr
      t.boolean :adjust
      t.string :date
      t.string :creator
      t.string :addressee
      t.integer :type
      t.integr :copytype
      t.integer :script
      t.boolean :envelope
      t.string :title
      t.text :summary
      t.text :notes
      t.string :tags
      t.string :answers
      t.string :answeredby
      t.string :hascopy
      t.string :copyof

      t.timestamps
    end
  end
end
