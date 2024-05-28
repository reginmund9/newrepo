const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector(".submitBtn") 
      updateBtn.removeAttribute("disabled")
})

//input type="submit" value="Update Vehicle" disabled class="submitBtn" from edit-inventory.ejs 

