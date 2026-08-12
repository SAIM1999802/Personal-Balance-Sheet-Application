// const token = localStorage.getItem('token');
// if (!token) {
//   window.location.replace("login.html");
// }

let bal = 0;
$(document).ready(() => {
  loadTransactions();

  $("#logoutBtn, .logout-btn").on("click", (e) => {
    e.preventDefault();
    API.logout();
  });
});

async function loadTransactions() {
  try {
    const data = await API.getTransactions();
    $("#tab tbody").remove(); 

    if (Array.isArray(data) && data.length > 0) {
      let tbodyHtml = '<tbody class="tbody">';
      data.forEach((item) => {
        bal = Number(item.balance);
        tbodyHtml += `
          <tr class="trow">
              <td>${item.descriptions}</td>
              <td>${item.typess === "debit" ? item.amount : ""}</td>
              <td>${item.typess === "credit" ? item.amount : ""}</td>
              <td>${item.balance}</td>
          </tr>`;
      });
      tbodyHtml += '</tbody>';
      $("#tab").append(tbodyHtml);
    } else {
      bal = 0;
    }
  } catch (err) {
    console.error("Error loading transactions:", err);
  }
}

$("#myForm").on("submit", async (e) => {
  e.preventDefault();
  let val = Number($("#input").val());
  let desc = $("#desc").val().trim();

  if (val === 0 && desc === "") {
    Swal.fire({ title: "Wrong!!", text: "Fill both values", icon: "error" });
    return;
  }
  if (desc === "") {
    Swal.fire({ title: "Wrong!!", text: "Fill description", icon: "error" });
    return;
  }
  if (val === 0 || isNaN(val)) {
    Swal.fire({ title: "Wrong!!", text: "Please enter a valid non-zero amount", icon: "error" });
    $("#input").val("");
    return;
  }

  if (val > 0) {
    bal += val;
    appendRow(desc, val, "", bal);
    await API.saveTransactions({ desc, val, bal, type: "debit" });
  } else {
    let amountToWithdraw = Math.abs(val);
    if (amountToWithdraw > bal) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Your Balance is ${bal} and amount requested is ${amountToWithdraw}`
      });
      return;
    }
    bal -= amountToWithdraw;
    appendRow(desc, "", amountToWithdraw, bal);
    await API.saveTransactions({ desc, val: amountToWithdraw, bal, type: "credit" });
  }

  $("#input").val("");
  $("#desc").val("");
});

function appendRow(desc, debit, credit, balance) {
  if ($("#tab tbody").length === 0) {
    $("#tab").append('<tbody class="tbody"></tbody>');
  }
  $("#tab tbody").append(`
      <tr class="trow">
          <td>${desc}</td>
          <td>${debit}</td>
          <td>${credit}</td>
          <td>${balance}</td>
      </tr>
  `);
}

$("#btn2").click(() => {
  Swal.fire({
    title: "Are you sure?",
    text: "This will delete all transactions from database",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, Clear All!",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await API.clearTransactions();
      if (res.success) {
        $("#tab tbody").remove();
        bal = 0;
        Swal.fire({ title: "Cleared!", text: "All transactions cleared.", icon: "success" });
      } else {
        Swal.fire({ title: "Error!!", text: res.message || "Failed to clear", icon: "error" });
      }
    }
  });
});

$("#btn3").click(() => {
  const tab = document.querySelector("#tab");
  if (!tab || tab.querySelectorAll("tbody tr").length === 0) {
    Swal.fire({ icon: "error", title: "Oops...", text: "Your Table is Empty" });
    return;
  }
  const workSht = XLSX.utils.table_to_sheet(tab);
  const workBk = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBk, workSht, "Balance_Sheet");
  XLSX.writeFile(workBk, `Balance_sheet.xlsx`);
});

$("#importBtn").click(() => {
  $("#importFile").click();
});

$("#importFile").on("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = async (ee) => {
    try {
      const data = new Uint8Array(ee.target.result);
      const workBk = XLSX.read(data, { type: "array" });
      const fSheet = workBk.SheetNames[0];
      const workSheet = workBk.Sheets[fSheet];
      const jsonOut = XLSX.utils.sheet_to_json(workSheet, { header: 1 });

      if (jsonOut.length <= 1) {
        Swal.fire({ icon: "error", title: "Oops...", text: "Uploaded file is empty" });
        return;
      }

      for (let i = 1; i < jsonOut.length; i++) { 
        const row = jsonOut[i];
        if (!row || row.length === 0) continue;

        const desc = row[0] || "Imported";
        const deb = Number(row[1]) || 0;
        const cre = Number(row[2]) || 0;
        let val = 0;
        let type = "";

        if (deb > 0) {
          val = deb;
          type = "debit";
          bal += val;
        } else if (cre > 0) {
          val = cre;
          type = "credit";
          bal -= val;
        } else continue;

        appendRow(desc, type === "debit" ? val : "", type === "credit" ? val : "", bal);
        await API.saveTransactions({ desc, val, bal, type });
      }

      $("#importFile").val("");
      Swal.fire({ title: "Success!", text: "Data imported successfully!", icon: "success" });
    } catch (error) {
      Swal.fire({ title: "Error!!", text: "Data import failed!", icon: "error" });
    }
  };
});