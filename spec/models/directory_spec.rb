require 'spec_helper'

describe Directory do
	it "has a valid factory" do
		expect(FactoryGirl.build(:directory)).to be_valid
	end

	it "is invalid without a dirpath" do
	  directory = FactoryGirl.build(:directory, dirpath: nil)
	  directory.valid?
	      expect(directory.errors[:dirpath]).to include("can't be blank")
	end

	it "returns a directory's dirpath as a string" do
		  directory = FactoryGirl.build(:directory,
					          dirpath: "/tmp"
		    )
		      expect(directory.dirpath).to eq '/tmp'
	end
## more specs
end
