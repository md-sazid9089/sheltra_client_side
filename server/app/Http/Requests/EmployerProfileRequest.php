<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployerProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'company_name' => ['required', 'string', 'max:255'],
            'industry' => ['required', 'string', 'max:100'],
            'company_size' => ['required', 'in:1-10,11-50,51-200,201-500,500+'],
            'location' => ['required', 'string', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'phone' => ['nullable', 'regex:/^\+?[0-9]{10,15}$/'],
            'description' => ['nullable', 'string', 'max:2000'],
            'ethical_hiring_pledge' => ['required', 'boolean'],
            'contact_email' => ['required', 'email', 'max:255'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'company_name.required' => 'Company name is required.',
            'industry.required' => 'Industry is required.',
            'company_size.required' => 'Company size is required.',
            'company_size.in' => 'Please select a valid company size.',
            'location.required' => 'Location is required.',
            'website.url' => 'Website must be a valid URL.',
            'phone.regex' => 'Phone number must be valid.',
            'ethical_hiring_pledge.required' => 'You must agree to ethical hiring practices.',
            'contact_email.required' => 'Contact email is required.',
            'contact_email.email' => 'Contact email must be valid.',
        ];
    }
}

