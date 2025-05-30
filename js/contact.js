import supabase from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit');
  const statusMsg = document.getElementById('contact-status');

  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    submitBtn.disabled = true;
    statusMsg.textContent = '';

    const data = {
      full_name: form.full_name.value.trim(),
      job_title: form.job_title.value.trim(),
      business_email: form.business_email.value.trim(),
      company: form.company.value.trim(),
      solution: form.solution.value,
      message: form.message.value.trim(),
      agree_privacy: form.agree_privacy.checked,
      agree_marketing: form.agree_marketing.checked
    };

    // Basic validation
    if (!data.full_name || !data.job_title || !data.business_email || !data.company || !data.solution) {
      statusMsg.textContent = 'Please fill in all required fields.';
      submitBtn.disabled = false;
      return;
    }

    const { error } = await supabase.from('contact_form').insert([data]);
    if (error) {
      statusMsg.textContent = 'Submission failed. Please try again.';
      submitBtn.disabled = false;
    } else {
      statusMsg.textContent = 'Thank you! Your message has been sent.';
      form.reset();
      submitBtn.disabled = false;
    }
  });
});
