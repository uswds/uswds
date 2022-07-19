function ready(fn) {
  document.addEventListener("DOMContentLoaded", fn, false);
}

ready(() => {

    console.log('hey!');

    // Phone Mask
    document.getElementById('phone').addEventListener('input', (e) => {
        const x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : `(${x[1]}) ${x[2]}${x[3] ? `-${x[3]}` : ''}`;
    });

    // SSN Mask
    document.getElementById('ssn').addEventListener('input', (e) => {
        const x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,2})(\d{0,4})/);
        e.target.value = `${x[1]} ${x[2]} ${x[3]}`;
    });

});