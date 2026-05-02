<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->enum('type', ['mobile_app', 'web_app']);
            $table->enum('platform', ['android', 'ios', 'both', 'web']);
            $table->string('url')->nullable();
            $table->string('apk_url')->nullable();
            $table->string('store_link')->nullable();
            $table->text('description');
            $table->json('test_scope')->nullable(); // {features: [], scenarios: [], known_issues: []}
            $table->json('test_credentials')->nullable(); // {email, password}
            $table->string('logo')->nullable();
            $table->boolean('is_open')->default(true);
            $table->enum('is_vibe_coded', ['yes', 'no', 'partially'])->default('no');
            $table->enum('status', ['draft', 'published', 'in_progress', 'completed', 'suspended'])->default('draft');
            $table->integer('expected_testers')->nullable();
            $table->timestamp('deadline')->nullable();
            $table->text('suspension_reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
