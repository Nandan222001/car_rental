<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->string('razorpay_order_id')->unique(); // Razorpay's order ID
            $table->string('receipt')->nullable();         // Custom receipt ID
            $table->unsignedBigInteger('amount');          // Stored in paise
            $table->string('currency', 10)->default('INR');
            $table->string('status')->default('created');  // created, paid, failed etc.

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
