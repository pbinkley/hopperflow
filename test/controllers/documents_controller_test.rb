require 'test_helper'

class DocumentsControllerTest < ActionController::TestCase
  setup do
    @document = documents(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:documents)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create document" do
    assert_difference('Document.count') do
      post :create, document: { addressee: @document.addressee, adjust: @document.adjust, answeredby: @document.answeredby, answers: @document.answers, bundleid: @document.bundleid, bundlenum: @document.bundlenum, copyof: @document.copyof, copytype: @document.copytype, creator: @document.creator, date: @document.date, envelope: @document.envelope, folder: @document.folder, hascopy: @document.hascopy, itemid: @document.itemid, notes: @document.notes, ocr: @document.ocr, pages: @document.pages, script: @document.script, source: @document.source, summary: @document.summary, tags: @document.tags, title: @document.title, type: @document.type }
    end

    assert_redirected_to document_path(assigns(:document))
  end

  test "should show document" do
    get :show, id: @document
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @document
    assert_response :success
  end

  test "should update document" do
    patch :update, id: @document, document: { addressee: @document.addressee, adjust: @document.adjust, answeredby: @document.answeredby, answers: @document.answers, bundleid: @document.bundleid, bundlenum: @document.bundlenum, copyof: @document.copyof, copytype: @document.copytype, creator: @document.creator, date: @document.date, envelope: @document.envelope, folder: @document.folder, hascopy: @document.hascopy, itemid: @document.itemid, notes: @document.notes, ocr: @document.ocr, pages: @document.pages, script: @document.script, source: @document.source, summary: @document.summary, tags: @document.tags, title: @document.title, type: @document.type }
    assert_redirected_to document_path(assigns(:document))
  end

  test "should destroy document" do
    assert_difference('Document.count', -1) do
      delete :destroy, id: @document
    end

    assert_redirected_to documents_path
  end
end
