<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerificationDecisionRequest extends FormRequest
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
            'decision' => ['required', 'in:approved,rejected,pending_review'],
            'feedback' => ['nullable', 'string', 'max:1000'],
            'documents_reviewed' => ['nullable', 'array'],
            'documents_reviewed.*' => ['string'],
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
            'decision.required' => 'Verification decision is required.',
            'decision.in' => 'Verification decision must be: approved, rejected, or pending_review.',
            'feedback.max' => 'Feedback cannot exceed 1000 characters.',
        ];
    }
}
