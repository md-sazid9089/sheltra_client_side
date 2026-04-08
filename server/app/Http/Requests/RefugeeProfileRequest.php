<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RefugeeProfileRequest extends FormRequest
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
            'full_name' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'regex:/^\+?[0-9]{10,15}$/'],
            'bio' => ['nullable', 'string', 'max:500'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:100'],
            'education' => ['nullable', 'string', 'max:1000'],
            'work_experience' => ['nullable', 'string', 'max:2000'],
            'availability' => ['nullable', 'string', 'in:immediate,2_weeks,1_month,not_available'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:50'],
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
            'full_name.required' => 'Full name is required.',
            'location.required' => 'Location is required.',
            'phone.regex' => 'Phone number must be valid (international format acceptable).',
            'skills.array' => 'Skills must be an array.',
            'languages.array' => 'Languages must be an array.',
        ];
    }
}
