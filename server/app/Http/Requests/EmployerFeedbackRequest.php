<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployerFeedbackRequest extends FormRequest
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
            'feedback_type' => ['required', 'in:positive,constructive,not_suitable'],
            'message' => ['required', 'string', 'min:10', 'max:1000'],
            'would_hire_again' => ['nullable', 'boolean'],
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
            'feedback_type.required' => 'Feedback type is required.',
            'feedback_type.in' => 'Feedback type must be: positive, constructive, or not_suitable.',
            'message.required' => 'Feedback message is required.',
            'message.min' => 'Feedback message must be at least 10 characters.',
            'message.max' => 'Feedback message cannot exceed 1000 characters.',
        ];
    }
}
