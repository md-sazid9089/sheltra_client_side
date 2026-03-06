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
            'alias_name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'regex:/^\+?[0-9]{10,15}$/'],
            'country_of_origin' => ['required', 'string', 'max:100'],
            'legal_status' => ['required', 'in:refugee,asylum_seeker,internally_displaced'],
            'availability' => ['required', 'in:full_time,part_time,flexible,not_available'],
            'experience_summary' => ['nullable', 'string', 'max:1000'],
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
            'country_of_origin.required' => 'Country of origin is required.',
            'legal_status.required' => 'Legal status is required.',
            'legal_status.in' => 'Legal status must be one of: refugee, asylum_seeker, or internally_displaced.',
            'availability.required' => 'Availability status is required.',
            'availability.in' => 'Availability must be: full_time, part_time, flexible, or not_available.',
            'phone.regex' => 'Phone number must be valid (international format acceptable).',
        ];
    }
}
