<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Étape 1 : Infos générales
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'type' => ['required', 'in:mobile_app,web_app'],
            'platform' => ['required', 'in:android,ios,both,web'],
            'is_vibe_coded' => ['required', 'in:yes,no,partially'],

            // Étape 2 : Liens et accès
            'url' => ['nullable', 'url', 'required_if:type,web_app'],
            'store_link' => ['nullable', 'url'],
            'apk_url' => ['nullable', 'url'],
            'test_credentials' => ['nullable', 'array'],
            'test_credentials.email' => ['nullable', 'string'],
            'test_credentials.password' => ['nullable', 'string'],
            'google_tester_emails' => ['nullable', 'string'],

            // Étape 3 : Portée du test
            'test_scope' => ['nullable', 'array'],
            'test_scope.features' => ['nullable', 'array'],
            'test_scope.scenarios' => ['nullable', 'array'],
            'test_scope.known_issues' => ['nullable', 'array'],
            'expected_testers' => ['nullable', 'integer', 'min:1'],
            'deadline' => ['nullable', 'date', 'after:today'],

            // Logo
            'logo_file' => ['nullable', 'image', 'max:2048'], // 2MB max
            'requirements_file' => ['nullable', 'file', 'mimes:pdf,doc,docx,txt', 'max:5120'], // 5MB max

            // Étape 4 : Type de test
            'is_open' => ['required', 'boolean'],
            'status' => ['required', 'in:draft,published'],
        ];
    }
}
