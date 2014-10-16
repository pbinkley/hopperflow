require 'test_helper'

class DirectoryTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  test "directory must exist" do
	  directory = Directory.new
	  assert_raises(RuntimeError)
  end

  test "must flunk" do
	  flunk("I'm flunking")
  end
end
